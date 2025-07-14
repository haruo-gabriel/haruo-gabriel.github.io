// js/data.js
export const contentData = {
	"sobre-mim": {
		title: "sobre mim",
		description: [
			"Um pequeno portfolio digital de projetos que fiz e ando fazendo.",
			"TODO: escrever algo interessante aqui.",
		],
		items: [],
	},
	musicas: {
		title: "músicas",
		description: [
			"Algumas das minhas composições autorais. Todas elas foram pensadas e produzidas no pequeno estúdio improvisado do meu próprio quarto. Colchões cobrindo as portas, paredes e janelas são cenas bem comuns por aqui. São essas gambiarras que dão vida à arte.",
		],
		items: [
			{
				type: "image",
				cover: "assets/images/a_deriva-capa.png",
				alt: "à deriva capa",
				title: "à deriva (Single)",
				description:
					"Violão de nylon solo capturado com um simples microfone dinâmico. Processado com síntese granular.<br>Arte feita por <a href='https://www.instagram.com/gigileonardi/' target='_blank' rel='noopener'>@gigileonardi</a>.<br>Ouça pelo <a href='https://on.soundcloud.com/mMu3KjopwNd7j9r0od' target='_blank' rel='noopener'>Soundcloud</a>.",
			},
			{
				type: "image",
				cover: "assets/images/imensidao-capa.png",
				alt: "Imensidão, Pt. 1 capa",
				title: "Imensidão, Pt. 1 (EP)",
				description:
					"Trilha sonora interestelar. Feito exclusivamente com síntese sonora e efeitos digitais.<br>Ouça pelo <a href='https://on.soundcloud.com/7FRyd7Ypc0UvA7Wl0s' target='_blank' rel='noopener'>Soundcloud</a>.",
			},
		],
	},
	textos: {
		title: "textos",
		description: [
			"Alguns pequenos resultados que construí com palavras. E que não são códigos.",
		],
		items: [
			{
				type: "paper",
				poemKey: "distancia",
				title: "Distância",
				tag: "poema",
			},
		],
	},
	eletronicos: {
		title: "eletrônicos",
		description: [
			"Minhas contribuições na produção de sintetizadores, pedais de efeitos e outros dispositivos eletrônicos. Sou eternamente grato, principalmente ao Vinícius Fernandes, da <a href='https://www.instagram.com/menis______/' target='_blank' rel='noopener'>Menis</a>, e ao Filipe Alberti, da <a href='https://www.instagram.com/beetronics/' target='_blank' rel='noopener'>Beetronics</a>, por terem me ensinado esses conhecimentos valiosos.",
		],
		items: [
			{
				type: "image",
				cover: "assets/images/mangione_nobg.png",
				alt: "Menis Mangione MFX",
				title: "Menis Mangione MFX",
				description:
					"Um pedal de guitarra multiefeito digital robusto, construído com o MCU Daisy Seed. Ele oferece uma distorção peculiar, baseada em wavefolding, redução de sample rate e um delay com LFO.",
			},
			{
				type: "custom",
				customContent: '<p id="big-interrogation">?</p>',
				title: "Menis Dub Siren (em produção)",
				description:
					"Um sintetizador digital minúsculo, mas poderoso, construído com o MCU Daisy Seed. Ele reinventa as clássicas sirenes do Dub Reggae. A combinação de 8 LFOs, um filtro ressonante com frequência de corte variável e controle de decay e pitch possibilita uma gama abrangente de timbres.",
			},
		],
	},
	softwares: {
		title: "softwares",
		description: ["Instrumentos e interfaces de expressões musicais digitais."],
		items: [
			{
				type: "placeholder",
				title: "Condusom",
				description:
					"Desenvolvido em python, Condusom é um sintetizador digital controlado pela webcam. Mostre a sua mão para a câmera e conduza o som com gestos e movimentos precisos.<br>Acesse pelo <a href='https://github.com/uspaudiotech/condusom' target='_blank' rel='noopener'>Github</a>.",
			},
			{
				type: "placeholder",
				title: "Do Zero ao Som: Criando Áudio Digital com Python",
				description:
					"Um breve material em Jupyter Notebook destinado para o workshop sobre síntese sonora digital do grupo de extensão acadêmico USPAudioTech.<br>Acesse pelo <a href='https://github.com/uspaudiotech/workshop-sintese' target='_blank' rel='noopener'>Github</a>.",
			},
		],
	},
	pesquisas: {
		title: "pesquisas",
		description: [
			"Investigações acadêmicas em música e tecnologia.",
			"Ainda com preguiça de preencher.",
		],
		items: [
			{
				type: "empty",
			},
			{
				type: "empty",
			},
		],
	},
};
