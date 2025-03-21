import mongoose from "mongoose";
import {translate} from "@vitalets/google-translate-api";
const faqSchema =new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true});
faqSchema.methods.translateLang=async function(field,lang,redisClient){
    try{
        const cachekey=`${this._id}_${field}_${lang}`;
        const cachedValue=await redisClient.get(cachekey);
        if(cachedValue){
            return cachedValue;
        }
        const translatedValue=await translate(this[field],{to:lang});
        await redisClient.set(cachekey,translatedValue.text);
        return translatedValue.text;
    }
    catch(err){
        console.log(err);
    }

}
export default mongoose.model("faqModel",faqSchema);