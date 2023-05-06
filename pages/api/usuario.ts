import type {NextApiRequest,NextApiResponse, NextApiHandler} from 'next' 
import { validarTokenJWT} from '../../middlewares/validarTokenJWT'

const usuarioendpoint = (req:NextApiRequest ,res: NextApiResponse )=>{
  return res.status(200).json('Usuario autenticado com sucesso ')
}

export default validarTokenJWT(usuarioendpoint);