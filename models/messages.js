import mongoose from 'mongoose'

const messageScheme = mongoose.Schema({
   message: {
      type: String,
      required: true,
   }
})

export default messageScheme
