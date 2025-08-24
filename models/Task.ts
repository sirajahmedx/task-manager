import mongoose from 'mongoose';

export interface ITask {
  _id?: string;
  title: string;
  description?: string;
  status: 'todo' | 'doing' | 'done' | 'backlog';
  user: mongoose.Schema.Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TaskSchema = new mongoose.Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    status: {
      type: String,
      enum: ['todo', 'doing', 'done', 'backlog'], // Ensure 'backlog' is present
      default: 'todo',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
TaskSchema.index({ status: 1 });
TaskSchema.index({ createdAt: -1 });

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);