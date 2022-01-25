export enum EMessageType {
    Log   = 1,
    Text  = 2,
    Photo = 3,
    Video = 4,
    Url   = 5
}
  
export class Message {
    userName:  string;
    content:   string;
    type:      EMessageType;
    createdAt: Date;
  
    constructor(userName: string, content: string, type: EMessageType) {
        this.userName = userName;
        this.content = content;
        this.type = type;
        this.createdAt = new Date();
    }
}  