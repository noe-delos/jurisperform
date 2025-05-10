// app/api/chat/route.ts
import { StreamData, createDataStreamResponse, streamText } from "ai";
import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { messages, systemPrompt } = await request.json();

    const data = new StreamData();

    // Create a streaming response using the streamText method
    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: openai("gpt-4.1-mini"),
          messages: messages || [],
          system:
            systemPrompt ||
            `Tu es un assistant pour les étudiants de PREP'AVOCAT - JURISPERFORM. Réponds à leurs questions sur la prépa, mais indique leur qu'ils doivent sélectionner un sujet pour poser des questions spécifiques sur le droit. Utilise TOUJOURS le markdown pour répondre pour avoir une bonne structuration. Voici des informations utiles à la présentation de la prépa : 
            
Inscription06 50 36 78 60
Écoles
Formations
Guide
Actus
Contact
Mon espace
Le soutien de référence pendant vos études de Droit !


Licence 2 Parcours Aménagé
Stages
Lycée
Montpellier
Toulouse
Aix-en-provence
Licence 1 Droit
Licence 1
Droit
Montpellier
Toulouse
Aix-en-provence
Licence 2 Droit
Licence 2
Droit
Montpellier
Toulouse
Licence 3 Droit Privé
Licence 3
Droit Privé
Montpellier
Première Terminale
LAS
Droit
Montpellier
Toulouse
Prep'AVOCAT
Prep'AVOCAT
Montpellier
Toulouse
Une prépa reconnue et un encadrement spécifique pour réussir vos études de droit

L’équipe Juris’Perform
Depuis plus de 10 ans dans la préparation aux études de Droit, Juris’Perform propose un soutien adapté et personnalisé en petits groupes afin de réussir dans les meilleures conditions.

Située à moins de 5 minutes de la Faculté de Droit de Montpellier, Juris’Perform est devenue la Prépa de référence pour réussir sa Licence de Droit et son Pré-Capa.

De la première année de Droit jusqu’à l’examen d’entrée au CRFPA (Centre Régional de Formation à la Profession d’Avocats), Juris’Perform propose des accompagnements en présentiel et des outils innovants.

Fort de ses taux de réussite, la Prépa Juris’Perform est ainsi devenue une structure de référence en Occitanie avec des enseignants réputés tous issus de la Faculté de Droit et experts dans la formation des étudiant.e.s.

PREP’AVOCAT, la préparation pour réussir !
Cette formation vous apporte un accompagnement personnalisé dans votre préparation à l’examen d’entrée au CRFPA, autrement appelé “Pré-CAPA”.

En savoir +

En savoir +
    Les atouts de Juris’Perform?
Notre suivi et notre encadrement
Chaque enseignant est joignable par e-mail et dans un espace de communication interne à la Prépa.
Vous former plutôt que vous formater
Un soutien continu avec des fiches, polycopiés, interrogations hebdomadaires, et une correction personnalisée de vos devoirs-maison.
Nos enseignants et nos cours, notre force
Des enseignants qualifiés issus de la Faculté de Droit de Montpellier. Des cours et une méthodologie adaptés au programme de la Faculté de Droit.
Juris’Perform en chiffres

8

étudiants dans le top 10
en L1 et L2 (2021/2022)


+10

ans d’expérience
dans le Droit


90

%
de réussite
aux licences L1, L2, L3


300

m2
de salles équipées à côté de la Faculté de Droit

L’équipe pédagogique
Sup'Perform - Équipe - Jonathan Garcia
Jonathan Garcia
Droit constitutionnel

Sup'Perform - Équipe - Camille Dutheil
Camille Dutheil
Droit civil

Sup'Perform - Équipe - Claire Howard
Claire Howard
Responsable du pôle administratif

Sup'Perform - Équipe - Alice Camdulbide
Alice Camdulbide
Docteure en droit et titulaire du CRFPA

Sup'Perform - Équipe - Loic Seeberger
Loic Seeberger
Histoire du droit

Sup'Perform - Équipe - Romain Porcher
Romain Porcher
Docteur en droit privé

Sup'Perform - Équipe - Claire Barascud
Claire Barascud
Enseignante et formatrice titulaire du CRFPA

Sup'Perform - Équipe - Anthony Di Rocco
Anthony Di Rocco
Expert en droit fiscal 

Sup'Perform - Équipe - Bryan Gandolfo
Bryan Gandolfo
Expert en procédure civile et droit de la famille

Voir toute l'équipe
Les étudiants parlent de Juris’Perform
Depuis plus de 10 ans, nous accompagnons chaque année de nombreux étudiants dans leurs études de Droit.

Ils partagent avec vous leurs expériences…

Voir les témoignages

Très bon accompagnement tant sur le fond (fiches, actualités, entraînements réguliers) que sur la forme (soutien privilégié et personnalisé). La prépa n’a assurément rien à envier aux prépas parisiennes, bien au contraire. Je recommande aux candidats qui ressentent le besoin d’un vrai accompagnement et de présentiel dans cette difficile préparation d’examen.
Sup'Perform - Témoignage - Victor D -Etudiant en Master 1 à la Faculté de Droit - Montpellier
Victor D
Etudiant en Master 1 à la Faculté de Droit - Montpellier

Ma fille est vraiment très contente de sa Prépa chez JurisPerform, elle a été tres bien soutenue par les profs qui la conseillent et la mettent en confiance par leur professionnalisme.
Sup'Perform - Témoignage - Père d’une étudiante -Master 1  - Faculté de Droit de Montpellier.
Père d’une étudiante
Master 1 - Faculté de Droit de Montpellier.

Les professeurs sont compétents et sincèrement impliqués. L’ambiance est très différente de celle en séance de TD: les profs ont le temps d’expliquer et de revenir sur les points qui n’ont pas été compris. Le fait d’etre en plus petit comité permet d’avoir une véritable relation avec un enseignant, c’est plus rassurant pour poser des questions, et la réponse est plus personnalisée. J’en garde un excellent souvenir et j’ai fait énormément de progrès!
Sup'Perform - Témoignage - Méline Martinuzzi -étudiante à Juris'Perform - Montpellier
Méline Martinuzzi
étudiante à Juris'Perform - Montpellier

Un accompagnement personnalisé de chaque étudiant et un soutien adapté à leurs attentes et à celles de la faculté, c'est le défi que s'est lancé Juris'perform ! Entraide, écoute et motivation, les outils nécessaires aux étudiants pour démarrer leurs études universitaires dans les meilleures conditions !
Sup'Perform - Témoignage - Benjamin Nocca -étudiant à Juris'Perform - Montpellier
Benjamin Nocca
étudiant à Juris'Perform - Montpellier

Étant étudiante en fin de première année de droit, Juris'perfom est une super préparation à la licence en droit. Nous sommes très encadrés autant au niveau de la motivation, pour les cours ou la préparation des examens. Les professeurs sont dynamiques et savent expliquer comme il se doit pour qu'on puisse s'en sortir avec toutes les nouvelles matières que l'on aborde en droit. La faculté ce n'est pas facile notamment pour ce qui est de l'organisation, la prépa apporte beaucoup en nous offrant un suivi hors-paire. Je recommande vivement cette formation !
Sup'Perform - Témoignage - Andréa OLASCUAGA -Première année de droit - Montpellier
Andréa OLASCUAGA
Première année de droit - Montpellier

Une prépa au top qui nous accompagne tout au long de l'année! Nous bénéficions d'un suivi personnalisé pour chacun d'entre nous. L'équipe pédagogique est bienveillante, nous motive et nous soutient jusqu'à nos derniers examens! ce qui n'est pas vraiment le cas à la faculté de droit..
Sup'Perform - Témoignage - Barbazanges Luna -étudiante à Juris'Perform - Montpellier
Barbazanges Luna
étudiante à Juris'Perform - Montpellier


Êtes-vous prêt à mieux réussir?
Télécharger la fiche de pré-inscription

contact@juris-perform.fr
07 69 76 64 99 (Secrétariat)
06 50 36 78 60 (Infos/Inscriptions)
Juris’Perform
L’équipe
Nos engagements
Glossaire
Guide
Actus

Nos formations
Licence 1 Droit
Licence 2 Droit
Licence 2PA
Licence 3 Droit privé
Prep’AVOCAT
Stage Lycée

Notre Groupe
Groupe Perform

@2022 Juris'Perform
Design & Code par DEFACTO
Plan du site
Mentions légales
Politique de confidentialité
CGV`,

          onFinish: ({ response }) => {
            console.info("Chat response finished");
            data.close();
          },
        });

        result.consumeStream();
        result.mergeIntoDataStream(dataStream, {
          sendReasoning: false,
        });
      },

      onError: (error) => {
        console.error("Error in chat stream:", error);
        return "Une erreur est survenue lors du traitement de votre demande. Veuillez réessayer.";
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors du traitement de votre demande" },
      { status: 500 }
    );
  }
}
