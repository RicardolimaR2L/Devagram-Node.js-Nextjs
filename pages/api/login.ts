import type {NextApiRequest, NextApiResponse} from 'next';

export default (
req : NextApiRequest,
res : NextApiResponse
) => {
if( req.method === "POST" ){
  const {login, senha} = req.body;
 // Validaçaõ do method


  if( login === 'admin@admin.com' && 
       senha === 'admin@123'){
 // validaçao das informações de login

        
      res.status(200).json({msg: 'Usuario autenticado com sucesso'})
        //mensagem de sucesso(caso as informaçoes estejam corretas)
      } 
         return res.status(405).json({erro: 'Usuário ou senha não encontrado'})
      }
        return res.status(405).json({erro: 'metodo informado não é válido'}) 
} 