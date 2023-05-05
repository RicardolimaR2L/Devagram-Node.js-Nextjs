import type { NextApiRequest, NextApiResponse } from "next";
import type{ RespostaPadraoMsg} from '../../types/RespostaPadraoMsg'
import type{CadastroRequisicao} from '../../types/CadastroRequisicao'  
import {UsuarioModel} from '../../models/UsuarioModel'
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import md5 from 'md5'; 


const endpointCadastro = 
 async (req :NextApiRequest , res: NextApiResponse<RespostaPadraoMsg> )=>{

  
  if(req.method === 'POST'){
      const usuario = req.body as CadastroRequisicao;
      // validação do metodo "POST"
      // dizendo que const usuario = req.body as CadastroRequisicao; 
      // vai ter os seguintes dados (Nome, Email, Senha) para serem preenchidos

        if(!usuario.nome || usuario.nome.length < 2 ){
          return res.status(400).json({erro : 'Nome invalido'});

        }

        if( !usuario.email || usuario.email.length < 2 
            || !usuario.email.includes('@') 
            || !usuario.email.includes('.') ){
            return res.status(400).json({erro : 'Email invalido (ta fazendo errado)'});

           }
           if(!usuario.senha || usuario.senha.length < 4  ){
            return res.status(400).json({erro: 'Senha invalida'})
           }

           //validação se ja existe um usuário com o mesmo email
           const usuariosComMesmoEmail = await UsuarioModel.find({email: usuario.email});
           if(usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0 ){

            return res.status(400).json({erro: 'ja existe uma conta com o Email informado '}) 

           }

           //salvar no Banco de Dados
           const UsuarioASerSalvo= {
            nome:usuario.nome,
            email:usuario.email,
            senha: md5(usuario.senha) //'md5' e usado para criptografar a senha 
           }
            await UsuarioModel.create(UsuarioASerSalvo); 
           return res.status(200).json({msg: 'Usuario criado com sucesso'});

    }
  return res.status(405).json({erro : 'metodo informado nao e valido' })
}
export default conectarMongoDB  (endpointCadastro);
