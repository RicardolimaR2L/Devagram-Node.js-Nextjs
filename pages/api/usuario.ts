import type {NextApiRequest,NextApiResponse} from 'next' 
import { validarTokenJWT} from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { RespostaPadraoMsg } from '@/types/RespostaPadraoMsg';
import { UsuarioModel } from '@/models/UsuarioModel';

const usuarioendpoint = async (req:NextApiRequest ,res: NextApiResponse<RespostaPadraoMsg | any > )=>{
  
try {

  //Busca do usuario no banco de dados
  //usuario.senha = null é para não mostrar a senha na chamda da  api 
  const {UserId} = req?.query;
  const usuario = await UsuarioModel.findById(UserId);
  usuario.senha= null
  return res.status(200).json(usuario);
  


} catch(e){
  console.log(e)
  return res.status(400).json({erro: 'Nao foi possivel obter dados do usuario'})
  

}



}

export default validarTokenJWT(conectarMongoDB(usuarioendpoint));