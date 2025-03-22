import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }, // Responsibilities of the department
    officers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ], // Users who are officers in this department
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
});

export default mongoose.model("departmentModel", departmentSchema);