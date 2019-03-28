# visualeffects
Kurs Visuelle Effekte WS 2018/2019 Hochschule Fulda 

Teilnehmer: Nicolai Fröhlig <br>
Matrikelnummer: 639186 <br>
Projekt: Fresnel Effekt (Ist dann im Ordner "\Fresnel") <br>

Um das Projekt laufen lassen zu können, auf lokalen Server starten lassen (Live-Server von VSCode, XAMPP, etc.) und auf die jeweiligen html-Dateien navigieren (index.html in Fresnel-Ordner).

Um dabei die verschiedenen Szenen zu benutzen, müssen verschiedene JavaScript-Dateien in der Zeile 24 der index.html eingebunden werden:
<br>
<ol>
    <li> app.js => Szene mit Kombination der verschiedenen Fresnel Effekte und Reflexionen</li>
    <li> appEmpiricialFresnel.js => Szene mit de empirischen Fresnel-Effekt</li>
    <li> appSchlickFresnel.js => Szene mit den Fresnel-Effekt der Schlick-Approximation</li>
    <li> appEnvMap.js => Szene mit EnvironmentMap und Fresnel-Shader-Cube</li>
</ol>
Das Repository enthält dabei Code von:
<ul>
    <li>gl-Matrix: https://github.com/toji/gl-matrix </li>
    <li>OBJ-Loader, welcher in dem Modul vorgegeben wurde </li>
</ul>
Weiterhin enthält das Repository Models von:
<br>
<ul>
    <li>Mobster: https://people.sc.fsu.edu/~jburkardt/data/obj/obj.html </li>
    <li>Capsule: http://paulbourke.net/dataformats/obj/minobj.html </li>
    <li>Skybox Textures: http://www.custommapmakers.org/skyboxes.php</li>
    <li>Metal Texture: https://freepbr.com/materials/rusted-iron-pbr-metal-material-alt/</li>
</ul>
<br>
Die Engine wurde in den Browsern Firefox und Chrome getestet.

