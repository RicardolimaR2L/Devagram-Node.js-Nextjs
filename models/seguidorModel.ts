import mongoose, {Schema} from "mongoose";


const seguidorSchema = new Schema({ // informações da tabela de seguidor 

  usuarioId : { type : String ,required: true},// quem segue
  usuarioSeguidoId: { type : String ,required: true} //quem esta sendo seguido
}) 

export const seguidorModel  //exportação da tabela de seguidores
= (mongoose.models.seguidores ||  //verifica se a tabela existe no banco de dados
  mongoose.model('seguidores', seguidorSchema)); // cria a tabela se ela não existir 

 