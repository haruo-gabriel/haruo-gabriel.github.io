// Homepage Component
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations/translations";

function Homepage() {
	const { language } = useLanguage();

	return (
		<div className="flex flex-col space-y-4">
			<div className="flex flex-col p-4 space-y-4">
				<h2 className="text-moso-black text-4xl font-medium text-right">
					formalidades
				</h2>
				<p className="text-moso-black font-light">
					<span className="font-normal">
						Universidade de São Paulo, Instituto de Matemática e Estatística
					</span>{" "}
					- Bach. em Ciência da Computação (em andamento)
				</p>
				<p className="text-moso-black font-light">
					Interesse em Processamento Digital de Sinais para Áudio e Imagem,
					Computação Musical, Computação Gráfica, Sistemas Embarcados para
					aplicações em áudio, Arte & Tecnologia.
				</p>
				<p className="text-moso-black font-light">
					Pesquisa no desenvolvimento do VORPAL: um middleware de áudio focado
					em trilhas sonoras procedurais em tempo real para jogos.
				</p>
			</div>
		</div>
	);
}

export default Homepage;
