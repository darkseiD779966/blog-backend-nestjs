import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty()
  @Prop({ required: true })
  email: string;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty({ enum: ['google', 'facebook'] })
  @Prop({ required: true, enum: ['google', 'facebook'] })
  provider: string;
}

// <-- Add this:
export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
