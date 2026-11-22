import mongoose  from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        select: false,
        required: function () { return !this.googleId; },
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true,

    },
    authProvider:{
        type:String,
        enum:["local","google"],
        default:"local",
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }
}, {
    timestamps: true
}

);

//hash password befor saving
userSchema.pre("save",async function () {
    // skip if the password didn't change OR is empty (Google accounts have none)
    if (!this.isModified("password") || !this.password) return;

    this.password = await bcrypt.hash(this.password, 10);
});

   

//verify password 
userSchema.methods.comparePassword=async function (password) {
   // Google-only accounts have no password, so there is nothing to compare
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);

}

const userModel = mongoose.model("user", userSchema)

export default userModel