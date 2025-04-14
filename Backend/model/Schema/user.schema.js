import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "officer", "user"],
        default: "user"
    },
    refreshToken:{
        type:String
    },
    profilePicture: {
        type: String,
        required:true
    },
    twoFactorToken:{
        type:String,//Base32 format 
    },
    otpExpiry:{
        type:Date
    },
     otpRequest:{
     type:[Date],
     default:[]
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
});
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password= await bcrypt.hash(this.password,10);
    next();
})
 userSchema.methods.isPasswordCorrect= async function (password) {
    return await bcrypt.compare(password,this.password)
 }
 userSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
            _id:this._id,
            firstName:this.firstName,
            email:this.email,
            username:this.username,
            role:this.role
        },
        process.env.ACCESS_TOKEN,
        {
            expiresIn: process.env.ACCESS_EXPIRY
        }
    )
 }
 userSchema.methods.genrateRefreshToken= function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN,
        {
            expiresIn:process.env.REFRESH_EXPIRY
        }
    )
 }

export default mongoose.model("User", userSchema);
