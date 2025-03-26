import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity('Chat')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column()
  sender: string;


  @Column()
  receiver: string;


  @Column('text')
  message: string;


  @CreateDateColumn()
  createdAt: Date;


  @UpdateDateColumn()
  updatedAt: Date;
}
