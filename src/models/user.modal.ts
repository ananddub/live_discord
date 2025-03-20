import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            required: true,
            type: String,
        },
        bio: {
            type: String,
            default: "",
        },
        friends: [
            {
                type: String,
                ref: "User",
            },
        ],
        pending: [
            {
                type: String,
                ref: "User",
            },
        ],
        block: [
            {
                type: String,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const uniqueArrayValidator = function (arr) {
    return arr.length === new Set(arr).size;
};

UserSchema.path("friends").validate(
    uniqueArrayValidator,
    "Duplicate friend IDs not allowed"
);

UserSchema.path("pending").validate(
    uniqueArrayValidator,
    "Duplicate pending IDs not allowed"
);

UserSchema.path("block").validate(
    uniqueArrayValidator,
    "Duplicate block IDs not allowed"
);

UserSchema.pre("save", function (next) {
    const allIds = [...this.friends, ...this.pending, ...this.block];

    const totalLength = allIds.length;
    const uniqueLength = new Set(allIds).size;

    if (totalLength !== uniqueLength) {
        return next(
            new Error(
                "Same user cannot be in multiple lists (friends/pending/reject/block)"
            )
        );
    }

    next();
});

export const User = mongoose.model("User", UserSchema);
