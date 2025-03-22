import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "resolved", "rejected"],
        default: "pending",
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }, // Officer assigned to resolve the complaint
    remarks: {
        type: String
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
});

export default mongoose.model("complaintModel", complaintSchema);