import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
              name:{
                  type: String,
                  required:[true, "please provider your name!"],
                  minlength:[3,"Name must contain at least 3 characters!"],
                  maxLength: [30,"Name cannot exceed 30 characters!"],         
              },
              email: {
                            type: String,
                            required:[true, "please provider your email!"],       
                             validate: [validator.isEmail, "Please provide a valid email!"],
              },
              phone:{
                            type: Number,
                            required:[true, "please provider your email!"],
              },
              password:{
                            type: String,
                            required:[true, "please provider your email!"],       
                             
                             minlength: [8,"Password must contain at least 3 characters!"],
                              maxLength: [32,"Password cannot exceed 32 characters!"],                        
                              select: false
                            },
role: {
              type: String,
              required:[true, "please provider your Role"], 
              enum: ["Job Seeker", "Employer"],
},
createdAt: {
              type: Date,
              default: Date.now,
},
});

//HASING THE PASSWORD
userSchema.pre("save", async function (next){
              if (!this.isModified("password")) {
              next();
              }
              this.password = await bcrypt.hash(this.password, 10);
});
//COMPARING PASSWORD
userSchema.methods.comparePassword = async function (enteredPassword){
              return await bcrypt.compare(enteredPassword, this.password);
};

//GENERATING A JWT TOKEN FOR AUTHORIZATION
userSchema.methods.geJWTToken = function (){
              return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
              expiresIn: process.env.JWT_EXPIRE,
            });
        };
         
        export const User = mongoose.model("User", userSchema);