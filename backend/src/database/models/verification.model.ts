import mongoose, { Document, Schema } from "mongoose";
import { VerificationEnum } from "../../common/enums/verification-code.enum";
import { generateUniqueCode } from "../../common/utils/uuid";

export interface verificationCodeDocument extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;
  type: VerificationEnum;
  expiredAt: Date;
  createdAt: Date;
}

const verificationCodeSchema = new Schema<verificationCodeDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true,
  },
  code: {
    type: String,
    unique: true,
    required: true,
    default: generateUniqueCode,
  },
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiredAt: {
    type: Date,
    required: true,
  },
});


const VerifiactionCodeModel = mongoose.model<verificationCodeDocument>('VerificationCode',verificationCodeSchema)
export default VerifiactionCodeModel;