//Importação do multer e do Cosmicjs
  import multer from "multer";
  import cosmicjs from  "cosmicjs";



  //captura das variaveis de ambiente {.ENV'S} 
  const {CHAVE_GRAVACAO_AVATARES,
    CHAVE_GRAVACAO_PUBLICACOES,
    BUCKET_AVATARES,
    BUCKET_PUBLICACOES} = process.env;

    
    
    //Instâcia do cosmicjs
    /*Uma instância do CosmicJS é uma implementação individual do sistema de gerenciamento de conteúdo CosmicJS*/
    const Cosmic = cosmicjs();
   
  
    //Instância dos buckets 
  //Dentro dos buckets ocorre a captura das informações (SLUG,WRITE_KEY) de cada bucket. 
  // o slug é um identificador exclusivo que é usado para identificar um conteúdo específico em um site ou aplicativo
  /* É como uma senha que dá acesso a um conteúdo específico e ajuda a proteger a segurança desse conteúdo. Os usuários
    podem gerar e revogar suas chaves write_key a qualquer momento para controlar o acesso ao seu bucket.*/

    const bucketAvatares = Cosmic.bucket({ 
      slug:BUCKET_AVATARES,
      write_key:CHAVE_GRAVACAO_AVATARES

    });

    const bucketPublicacoes = Cosmic.bucket({

      slug:BUCKET_PUBLICACOES,
      write_key:CHAVE_GRAVACAO_PUBLICACOES
    });

    
    const storage = multer.memoryStorage();
    /*Essa função  faz o multer gravar na memória da aplicação os pedacinhos da imagem ,
    até gravar toda a imagem esteja gravada e só depois que ele fará o upload da imagem.*/  
    
    
    const upload = multer({storage : storage}) 
    /* Função de upload para receber a imagem, indicando qual 
    o storage que deve ser usado para salvar a imagem  */


    const uploadImagemCosmic = async (req : any) => {
    //validação se na requisição chegou um arquivo, se ele tiver um nome cria um objeto. 
  
      if(req?.file?.originalname){
//console.log('media_object', req?.file?.originalname)
        const media_object ={
          originalname : req.file.originalname,
          buffer: req.file.buffer
        };

        
         
        //Aqui já com o objeto criado verificamos a URL e decidimos para qual bucket vai ser enviado. 
              if(req.url && req.url.includes('publicacao')){
        
          return await bucketPublicacoes.addMedia({ media : media_object})
        }else{
          
          return await bucketAvatares.addMedia({ media : media_object})

        }

        

      }
      
    }

    export {upload, uploadImagemCosmic};

  //exportação do serviço de uploadIamgemCosmic;