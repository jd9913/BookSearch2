const { User, Book }=require('../models');
const { signToken }=require('../utils/auth');
const { AuthenticationError }=require('apollo-server-express');

const resolvers={
    Query: {
        me: async(parent, args, context)=>{

            if(context.user){
                const userData=await User.findOne({ _id: context.user._id })
                .select('-__v -password')

                return userData;
            }
            throw new AuthenticationError('you must be logged in');
        },
       users: async()=>{
           return User.find()
           .select('-__v -password')
           .populate('books');
            
        },
        user: async(parent, { username })=>{
            return User.findOne({ username })
            .select('-__v -password')
            .populate('books')
        }

    },

    Mutation: {

        addUser: async(parent, args)=>{
            const user=await User.create(args);
            const token=signToken(user);

            return { token, user };
        },

        login: async(parent, { email, password })=>{
            const user = await User.findOne({ email });
            if(!user){
                throw new AuthenticationError('user not found')
            }
            const correctPw=await user.isCorrectPassword(password);

            if(!correctPw){
                throw new AuthenticationError('password not correct');
            }

            const token=signToken(user);
            return { token, user };
        },

       
        saveBook: async(parent, { input }, context)=>{
            if(context.user){
                const updatedUser=await User.findOneAndUpdate(
                    {_id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true }
                ).populate('books');

                return updatedUser;
            }
            throw new AuthenticationError('you must be logged in')
        },

        removeBook: async(parent, args, context)=>{
            if(context.user){
                const updatedUser=await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedbooks: { bookId: args.bookId } } },
                    { new: true }
                );
                return updatedUser;
            }

            throw new AuthenticationError('You must be logged in')
        }
    }
};

module.exports=resolvers;