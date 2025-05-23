import Agenda from "../models/Agenda"
import Contato from "../models/Contato"
import Local from "../models/Local"
import Materia from "../models/Materia"
import Monitoria from "../models/Monitoria"
import Usuario from "../models/Usuario"
import { opcoesCursos, TipoLocal } from "../utils/validacoes"

async function seed() {
    const cadastrar = true

    if (cadastrar){
    console.log('Iniciando cadastros...')

    // Cadastro dos usuários
    const usuarios = [
        { email:'teste@email.com', nome: 'Teste Gonçalves', teams: 'teste_Teams@email.com', //1
            curso: opcoesCursos.ads, tipo:'Aluno', idFoto: 4, ra: '1050482223030' },

        { email:'monitor@email.com', nome: 'Monitor de Teste', teams: 'monitor_Teams@email.com', //2
            curso: opcoesCursos.vazio, tipo:'Monitor', idFoto: 15, ra: '1050482223031' },

        { email:'aluno@email.com', nome: 'Aluno da FATEC', teams: 'aluno_Teams@email.com', //3
            curso: opcoesCursos.ads, tipo:'Aluno', idFoto: 26, ra: '1050482223032' },

        { email:'clauss@fatec.sp.gov.br', nome: 'Itala Murielle', teams: 'clauss_Teams@fatec.sp.gov.br', //4
            curso: opcoesCursos.vazio, tipo:'Monitor', idFoto: 28, ra: '1050482223033' }, 

        { email:'daniela@fatec.sp.gov.br', nome: 'Daniela Domingues', teams: 'daniela_Teams@fatec.sp.gov.br', //5
            curso: opcoesCursos.vazio, tipo:'Monitor', idFoto: 35, ra: '1050482223034'  },

        { email:'pedro@fatec.sp.gov.br', nome: 'Pedro Henrique', teams: 'pedro_Teams@fatec.sp.gov.br', //6
            curso: opcoesCursos.vazio, tipo:'Monitor', idFoto: 27, ra: '1050482223035' },

        { email:'graziealla@fatec.sp.gov.br', nome: 'Graziella Souza', teams: 'graziealla_Teams@fatec.sp.gov.br', //7
            curso: opcoesCursos.vazio, tipo:'Monitor', idFoto: 10, ra: '1050482223036' },

        { email:'victor@fatec.sp.gov.br', nome: 'Victor Scatamburlo', teams: 'victor_Teams@fatec.sp.gov.br', //8
            curso: opcoesCursos.vazio, tipo: 'Monitor', idFoto: 29, ra: '1050482223037' },

        { email:'itala@fatec.sp.gov.br', nome: 'Itala Murielle Marques Nascimento', teams: 'victor_Teams@fatec.sp.gov.br', //9
            curso: opcoesCursos.vazio, tipo: 'Monitor', idFoto: 12, ra: '1050482223038' },

        { email:'giu@fatec.sp.gov.br', nome: 'Giulia Rodrigues', teams: 'giu_Teams@fatec.sp.gov.br', //10
            curso: opcoesCursos.comex, tipo: 'Aluno', idFoto: 36, ra: '1050482223039' }
    ]

    await Promise.all(usuarios.map(async (dados) => { 
        const usuario = new Usuario()
        usuario.email = dados.email
        usuario.nome = dados.nome
        usuario.tipo = dados.tipo
        usuario.curso = dados.curso
        usuario.teams = dados.teams
        usuario.ra = dados.ra
        usuario.idFoto = dados.idFoto ? dados.idFoto : 13
        await usuario.save() 
      }))

      const teste = await Usuario.findOneBy({nome: "Teste Gonçalves"})
      const monitor = await Usuario.findOneBy({nome: "Monitor de Teste"})
      const aluno = await Usuario.findOneBy({nome: "Aluno da FATEC"})
      const clauss = await Usuario.findOneBy({nome: "Sérgio Clauss"})
      const daniela = await Usuario.findOneBy({nome: "Daniela Domingues"})
      const pedro = await Usuario.findOneBy({nome: "Pedro Henrique"})
      const graziella = await Usuario.findOneBy({nome: "Graziella Souza"})
      const victor = await Usuario.findOneBy({nome: "Victor Scatamburlo"})
      const itala = await Usuario.findOneBy({nome: "Itala Murielle Marques Nascimento"})


    // Cadastro das materias
    const materias = [
        { nome: 'Contabilidade', idFoto: 10, monitorias: 1 }, //1
        { nome: 'Simulação', idFoto: 13, monitorias: 2 }, //2
        { nome: 'Algoritmo', idFoto: 14, monitorias: 3 }, //3
        { nome: 'Informática', idFoto: 11, monitorias: 4 }, //4
        { nome: 'Análise Financeira', idFoto: 12, monitorias: 5 }, //5
        { nome: 'Monitoria de teste', idFoto: 6, monitorias: 6 }, //6
    ]

    await Promise.all(materias.map(async (dados) => { 
        const materia = new Materia()
        materia.nome = dados.nome
        materia.idFoto = dados.idFoto ? dados.idFoto : 1
        await materia.save() 
      }))

    const cont = await Materia.findOneBy({nome: 'Contabilidade', idFoto: 10})
    const simu = await Materia.findOneBy({nome: 'Simulação', idFoto: 13})
    const alg = await Materia.findOneBy({nome: 'Algoritmo', idFoto: 14})
    const financ = await Materia.findOneBy({nome: 'Análise Financeira', idFoto: 12})
    const info = await Materia.findOneBy({nome: 'Informática', idFoto: 11})
    const test = await Materia.findOneBy({nome: 'Monitoria de teste', idFoto: 6})

    //Cadastro dos locais
    const locais = [
        { numero: 10, tipo: TipoLocal.sala }, //1
        { numero: 14, tipo: TipoLocal.sala }, //2
        { numero: 15, tipo: TipoLocal.sala }, //3

        { numero: 6, tipo: TipoLocal.lab }, //4
        { numero: 7, tipo: TipoLocal.lab }, //5
        { numero: 11, tipo: TipoLocal.lab }, //6
        { numero: 12, tipo: TipoLocal.lab }, //7
        { numero: 13, tipo: TipoLocal.lab }, //8

        { tipo: TipoLocal.biblio }, //9

        { numero: 8, tipo: TipoLocal.lab }, //10

    ]

    await Promise.all(locais.map(async (dados) => { 
        const local = new Local()
        local.numero = dados.numero
        local.tipo = dados.tipo
        await local.save() 
      }))

    const local1 = await Local.findOneBy({id: 1})
    const local2 = await Local.findOneBy({id: 2})
    const local3  = await Local.findOneBy({id: 3})
    const local4  = await Local.findOneBy({id: 4})
    const local5  = await Local.findOneBy({id: 5})
    const local6  = await Local.findOneBy({id: 6})
    const local7  = await Local.findOneBy({id: 7})
    const local8  = await Local.findOneBy({id: 8})
    const local9  = await Local.findOneBy({id: 9})
    const local10  = await Local.findOneBy({id: 10})


    //Cadastro das monitorias
    const monitorias = [
        { dia_semana: 'Segunda-feira', horario_inicio: '18:00', horario_fim: '19:00', //1
        usuario: daniela, materia: cont, local: local5
        },
        { dia_semana: 'Segunda-feira', horario_inicio: '11:30', horario_fim: '13:00', //2
            usuario: pedro, materia: simu, local: local7
        },
        { dia_semana: 'Segunda-feira', horario_inicio: '11:00', horario_fim: '13:00', //3
            usuario: graziella, materia: alg, local: local4
        },
        { dia_semana: 'Segunda-feira', horario_inicio: '18:00', horario_fim: '19:00', //4
            usuario: monitor, materia: test, local: local5
        },


        { dia_semana: 'Terça-feira', horario_inicio: '18:00', horario_fim: '19:00', //1
            usuario: daniela, materia: cont, local: local5
        },
        { dia_semana: 'Terça-feira', horario_inicio: '11:30', horario_fim: '13:00', //2
            usuario: pedro, materia: simu, local: local8
        },
        { dia_semana: 'Terça-feira', horario_inicio: '07:00', horario_fim: '07:30', //3
            usuario: graziella, materia: alg, local: local4
        },
        { dia_semana: 'Terça-feira', horario_inicio: '17:00', horario_fim: '19:00', //4
            usuario: victor, materia: info, local: local4
        },
        { dia_semana: 'Terça-feira', horario_inicio: '09:00', horario_fim: '11:00', //5
            usuario: monitor, materia: test, local: local8
        },
        

        { dia_semana: 'Quarta-feira', horario_inicio: '18:00', horario_fim: '19:00', //1
            usuario: daniela, materia: cont, local: local5
        },
        { dia_semana: 'Quarta-feira', horario_inicio: '11:30', horario_fim: '13:00', //2
            usuario: pedro, materia: simu, local: local8
        },
        { dia_semana: 'Quarta-feira', horario_inicio: '07:00', horario_fim: '07:30', //3
            usuario: graziella, materia: alg, local: local4
        },
        { dia_semana: 'Quarta-feira', horario_inicio: '18:00', horario_fim: '20:40', //4
            usuario: itala, materia: financ, local: local10
        },
        { dia_semana: 'Quarta-feira', horario_inicio: '11:00', horario_fim: '13:00', //5
            usuario: monitor, materia: test, local: local4
        },


        { dia_semana: 'Quinta-feira', horario_inicio: '18:00', horario_fim: '19:00', //1
            usuario: daniela, materia: cont, local: local5
        },
        { dia_semana: 'Quinta-feira', horario_inicio: '11:30', horario_fim: '13:00', //2
            usuario: pedro, materia: simu, local: local6
        },
        { dia_semana: 'Quinta-feira', horario_inicio: '11:00', horario_fim: '13:00', //3
            usuario: graziella, materia: alg, local: local4
        },
        { dia_semana: 'Quinta-feira', horario_inicio: '11:00', horario_fim: '13:00', //4
            usuario: monitor, materia: test, local: local4
        },


        { dia_semana: 'Sexta-feira', horario_inicio: '07:00', horario_fim: '07:30', //1
            usuario: graziella, materia: alg, local: local4
        },
        { dia_semana: 'Sexta-feira', horario_inicio: '17:00', horario_fim: '19:00', //2
            usuario: victor, materia: info, local: local4
        },       
        { dia_semana: 'Sexta-feira', horario_inicio: '11:00', horario_fim: '13:00', //3
            usuario: monitor, materia: test, local: local4
        }     
    ]
    await Promise.all(monitorias.map(async (dados) => { 
        if (dados.usuario && dados.materia && dados.local){
        const monitoria = new Monitoria()
        monitoria.dia_semana = dados.dia_semana
        monitoria.horario_inicio = dados.horario_inicio
        monitoria.horario_fim = dados.horario_fim
        monitoria.usuario = dados.usuario
        monitoria.materia = dados.materia
        monitoria.local = dados.local
        await monitoria.save() 
     }
      }))

    //Cadastro de agendas
    const agendas = [
        { nomeMateria: 'Estatística', dia_semana: "Segunda-feira", horario_inicio: '09:30', horario_fim: '10:30', //1
            usuario: teste, local: local1 
        },
        { nomeMateria: 'Gestão de Equipes', dia_semana: "Segunda-feira", horario_inicio: '09:30', horario_fim: '10:30', //1
            usuario: teste, local: local2 
        },
        { nomeMateria: 'Gestão de Equipes', dia_semana: "Quinta-feira", horario_inicio: '09:30', horario_fim: '10:30', //1
            usuario: teste, local: local2
        }
    ]

    await Promise.all(agendas.map(async (dados) => { 
        if (dados.usuario && dados.local){
        const agenda = new Agenda()
        agenda.dia_semana = dados.dia_semana
        agenda.horario_inicio = dados.horario_inicio
        agenda.horario_fim = dados.horario_fim
        agenda.usuario = dados.usuario
        agenda.nome_materia = dados.nomeMateria
        agenda.local = dados.local
        await agenda.save()
    }
     }))

     //Cadastro de Contatos
    const contatos = [
        { nome: 'Daniela Domingues', teamsUser: 'daniela_domingues', teamsEmail: 'daniela_Teams@fatec.sp.gov.br', idFoto: 35, tipo: 'Monitor' },
        { nome: 'Pedro Henrique', teamsUser: 'pedro_henrique', teamsEmail: 'pedro_Teams@fatec.sp.gov.br', idFoto: 27, tipo: 'Monitor'  },
        { nome: 'Graziella Souza', teamsUser: 'graziella_souza', teamsEmail: 'graziella_Teams@fatec.sp.gov.br', idFoto: 10, tipo: 'Monitor'  },
        { nome: 'Victor Scatamburlo', teamsUser: 'victor_scatamburlo', teamsEmail: 'victor_Teams@fatec.sp.gov.br', idFoto: 29, tipo: 'Monitor'  },
        { nome: 'Itala Murielle', teamsUser: 'itala_murielle', teamsEmail: 'itala_Teams@fatec.sp.gov.br', idFoto: 12, tipo: 'Monitor'  },
        { nome: 'Simone Mendes', teamsUser: 'simone_mendes99', teamsEmail: 'simone_Teams@fatec.sp.gov.br', idFoto: 33, tipo: 'Professor'  },
        { nome: 'Alexandre Skupien', teamsUser: 'alexandre_skupien17', teamsEmail: 'alexandre_Teams@fatec.sp.gov.br', idFoto: 1, tipo: 'Professor'  },
        { nome: 'Laura Valentin', teamsUser: 'laura_valentin67', teamsEmail: 'laura_Teams@fatec.sp.gov.br', idFoto: 20, tipo: 'Professor'  },
        { nome: 'Sérgio Clauss', teamsUser: 'sergio_clauss', teamsEmail: 'clauss_Teams@fatec.sp.gov.br', idFoto: 28, tipo: 'Professor'  },
        { nome: 'Michel Munhoz', teamsUser: 'michel_munhoz', teamsEmail: 'michel_Teams@fatec.sp.gov.br', idFoto: 4, tipo: 'Professor'  }
    ]

    await Promise.all(contatos.map(async (dados) => { 
        const contato = new Contato()
        contato.nome = dados.nome
        contato.teamsUser = dados.teamsUser
        contato.teamsEmail = dados.teamsEmail
        contato.idFoto = dados.idFoto ? dados.idFoto : 36
        contato.tipo = dados.tipo
        await contato.save()
     }))
      console.log('Finalizando cadastros...')
    }
    else console.log('Ok!')
}

export default seed
