import type { NextApiRequest, NextApiResponse } from 'next';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { UsuarioModel } from '../../models/UsuarioModel';
import { PublicacaoModel } from '../../models/publicacaoModel';

const feedEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  try {
    if (req.method === 'GET') {
      console.log(UsuarioModel)
      if (req?.query?.id) {
        const usuario = await UsuarioModel.findById(req?.query?.id.trim());//Busca pelo usuario no banco de dados 
        if (!usuario) {
          return res.status(400).json({ erro: 'usuario nao encontrado' });//msgm de erro caso o usuario nao exista
        }
        const publicacoes = await PublicacaoModel.find({ idUsuario: usuario._id }).sort({ data: -1 });
        //Captura das publicacoes do usuario pelo UserId, ordenando de forma decresente de acordo com a data da mais nova para a mais antiga
        return res.status(200).json(publicacoes);
      }
    }
    return res.status(405).json({ erro: 'Método informado não é válido' });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ erro: 'Não foi possível obter o feed' });
  }
};

export default validarTokenJWT(conectarMongoDB(feedEndpoint));
