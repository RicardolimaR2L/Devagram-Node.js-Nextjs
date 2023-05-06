import type {NextApiRequest, NextApiResponse} from 'next';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import {UsuarioModel} from '../../models/UsuarioModel'
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'; 
import type { LoginResposta } from '../../types/LoginResposta'; 
//importaçao do padrao de resposta

const endpointLogin = async (
req : NextApiRequest,
res : NextApiResponse<RespostaPadraoMsg | LoginResposta >
) => {
const {MINHA_CHAVE_JWT} = process.env; 
if(!MINHA_CHAVE_JWT){
 return res.status(500).json({erro: 'Env jwt não informada'})
}
console.log(MINHA_CHAVE_JWT)
if( req.method === "POST" ){
  const {login, senha} = req.body;
 // Validaçaõ do method
const usuarioEncontrados = await UsuarioModel.find({email: login,senha:md5(senha)});// validação se o usuáro foi encontrado no banco
  if(usuarioEncontrados && usuarioEncontrados.length > 0  ){
 
    const usuarioEncontrado = usuarioEncontrados[0];
 
   const token  = jwt.sign({_id: usuarioEncontrado._id}, MINHA_CHAVE_JWT);
 // validaçao das informações de login 


 
 return res.status(200).json({
   nome : usuarioEncontrado.nome, 
   email : usuarioEncontrado.email,
    token });

 // validação das informações de login

        //mensagem de sucesso(caso as informaçoes estejam corretas)
      } 
      return res.status(405).json({erro: 'Usuário ou senha não encontrado'})
    }
        return res.status(405).json({erro: 'metodo informado não é válido'}) 
        //mensagem de erro caso as informaçoes nao estejam corretas

      } 

export default conectarMongoDB(endpointLogin);
//adiçao do middleware ao endpoint