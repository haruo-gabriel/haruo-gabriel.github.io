// Homepage Component
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations/translations";

function Homepage() {
	const { language } = useLanguage();

	return (
		<div className="flex flex-col max-w-[800px] w-full">
			{/* formalidades */}
			<div className="flex flex-col p-8 space-y-4">
				<h2 className="text-black text-4xl font-medium text-right">
					formalidades
				</h2>
				<p>
					<span className="font-normal">
						Universidade de São Paulo, Instituto de Matemática e Estatística
					</span>{" "}
					- Bach. em Ciência da Computação (em andamento)
				</p>
				<p>
					Interesse em{" "}
					<span className="font-normal">
						Processamento Digital de Sinais para Áudio e Imagem
					</span>
					, <span className="font-normal">Computação Musical</span>,{" "}
					<span className="font-normal">Computação Gráfica</span>,{" "}
					<span className="font-normal">
						Sistemas Embarcados para aplicações em áudio
					</span>
					, <span className="font-normal">Arte & Tecnologia.</span>
				</p>
				<p>
					Pesquisa no desenvolvimento do{" "}
					<span className="underline">
						VORPAL: um middleware de áudio focado em trilhas sonoras procedurais
						em tempo real para jogos
					</span>
					.
				</p>
			</div>
			{/* não-formalidades */}
			<div className="flex flex-col p-8 space-y-4">
				<h2 className="text-black text-4xl font-medium text-right">
					não-formalidades
				</h2>
				<p>
					Fora do acadêmico, costumo me divertir aprendendo sobre assuntos
					diversos. Na maior parte, bem mais que meu próprio campo de estudo.
					Alguns dos tópicos incluem:
				</p>
				<ul className="list-disc list-inside space-y-1 font-['Roboto_Mono'] font-light text-sm">
					<li>composição musical</li>
					<li>produção musical</li>
					<li>performance musical</li>
					<li>engenharia de som</li>
					<li>pedais de guitarra</li>
					<li>sintetizadores</li>
					<li>realmente ouvir música</li>
					<li>
						desenvolvimento de jogos (ironicamente e infelizmente, não tenho
						mais tanta paciência para jogar videogames)
					</li>
					<li>arquitetura</li>
					<li>design de produto</li>
					<li>design gráfico</li>
					<li>edição de fotos</li>
					<li>edição de vídeos</li>
					<li>interfaces humano-computador</li>
					<li>uma pequena dose de filosofia, linguagem e comunicação</li>
				</ul>
			</div>
			{/* projetos */}
			<div className="flex flex-col p-8 space-y-4">
				<h2 className="text-black text-4xl font-medium text-right">projetos</h2>
				<p>
					A vida só pode ser tolerada ao mergulhar no ciclo vicioso de absorver
					e criar. Aqui está um pequeno panorama dos meus projetos:
				</p>
				<div className="grid grid-cols-2 gap-4 mt-4">
					<div className="flex flex-col">
						<img
							src="/a_deriva-capa.png"
							alt="À Deriva - Capa"
							className="w-full h-auto"
						/>
					</div>
					<div className="flex flex-col">
						<img
							src="/imensidão-capa.png"
							alt="Imensidão - Capa"
							className="w-full h-auto"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Homepage;
