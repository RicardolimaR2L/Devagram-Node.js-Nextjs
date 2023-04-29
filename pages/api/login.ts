import type {NextApiRequest, NextApiResponse} from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';

import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'; 
//importaçao do padrao de resposta

const endpointLogin = (
req : NextApiRequest,
res : NextApiResponse<RespostaPadraoMsg>
) => {
if( req.method === "POST" ){
  const {login, senha} = req.body;
 // Validaçaõ do method


  if( login === 'admin@admin.com' && 
       senha === 'admin@123'){
 // validaçao das informações de login

        
     return res.status(200).json({msg : 'Usuario autenticado com sucesso'})
        //mensagem de sucesso(caso as informaçoes estejam corretas)
      } 
      return res.status(405).json({erro: 'Usuário ou senha não encontrado'})
    }
        return res.status(405).json({erro: 'metodo informado não é válido'}) 
        //mensagem de erro caso as informaçoes nao estejam corretas

      } 

export default conectarMongoDB(endpointLogin);
//adiçao do middleware ao endpoint