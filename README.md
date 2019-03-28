# visualeffects
Kurs Visuelle Effekte WS 2018/2019 Hochschule Fulda 

Teilnehmer: Nicolai Fröhlig <br>
Matrikelnummer: 639186 <br>
Projekt: Fresnel Effekt (Ist dann im Ordner "\Fresnel") <br>

Um das Projekt laufen lassen zu können, auf lokalen Server starten lassen (Live-Server von VSCode, XAMPP, etc.) und auf die jeweiligen html-Dateien navigieren (index.html in Fresnel-Ordner).

Um dabei die verschiedenen Szenen zu benutzen, müssen verschiedene JavaScript-Dateien in der Zeile 24 der index.html eingebunden werden:
    1. app.js => Szene mit Kombination der verschiedenen Fresnel Effekte und Reflexionen
    1. appEmpiricialFresnel.js => Szene mit de empirischen Fresnel-Effekt
    3. appSchlickFresnel.js => Szene mit den Fresnel-Effekt der Schlick-Approximation
    4. appEnvMap.js => Szene mit EnvironmentMap und Fresnel-Shader-Cube

Das Repository enthält dabei Code von:
    - gl-Matrix: https://github.com/toji/gl-matrix 
    - OBJ-Loader, welcher in dem Modul vorgegeben wurde

Weiterhin enthält das Repository Models von:
    - Mobster: https://people.sc.fsu.edu/~jburkardt/data/obj/obj.html 
    - Capsule: http://paulbourke.net/dataformats/obj/minobj.html 

Die Engine wurde in den Browsern Firefox und Chrome getestet.

