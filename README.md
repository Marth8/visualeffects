# visualeffects
Kurs Visuelle Effekte WS 2018/2019 Hochschule Fulda 

Teilnehmer: Nicolai Fröhlig <br>
Matrikelnummer: 639186 <br>
Projekt: Fresnel Effekt (Ist dann im Ordner "\Fresnel") <br>

Um das Projekt laufen lassen zu können, auf lokalen Server starten lassen (Live-Server von VSCode, XAMPP, etc.) und auf die  html-Datei navigieren (index.html in Fresnel-Ordner).

Um dabei die verschiedenen Szenen zu benutzen, müssen verschiedene JavaScript-Dateien in der Zeile 24 der index.html eingebunden werden (einfach eingebundene JavaScript-Datei in der index.html im "\Fresnel"-Ordner ändern):
<br>
<ol>
    <li> app.js => Szene mit Skybox und einer voll reflektiven Kugel</li>
    <li> appEmpiricialFresnel.js => Szene mit dem empirischen Fresnel-Effekt (alle Objekte)</li>
    <li> appSchlickFresnel.js => Szene mit dem Fresnel-Effekt der Schlick-Approximation (alle Objekte)</li>
    <li> appEnvMap.js => Szene mit einer voll reflektiven Kugen, welche eine Dynamic Environment Map benutzt (6x Rendering)</li>
    <li> appEnvMapFresnel.js => Szene mit dem Fresnel-Effekt der Schlick-Approximation auf dem mittleren Cube, projiziert auf die Dynamic Environment Map (6x Rendering).</li>
</ol>
Das Repository enthält dabei Code von:
<ul>
    <li>gl-Matrix: https://github.com/toji/gl-matrix </li>
    <li>OBJ-Loader, welcher in dem Modul vorgegeben wurde </li>
</ul>
Das Repository enthält Shader-Ideen von:
<ul>
    <li>Beleuchtung, Schatten und Fresnel Logik: https://learnopengl.com/book/learnopengl_book_bw.pdf </li>
    <li>Fresnel Logik: https://www.ronja-tutorials.com/2018/05/26/fresnel.html</li>
    <li>Fresnel Logik: http://kylehalladay.com/blog/tutorial/2014/02/18/Fresnel-Shaders-From-The-Ground-Up.html</li>
    <li>Dynamic Environment Map: http://math.hws.edu/graphicsbook/</li>
    <li>Dynamic Environment Map und Fresnel Effekt: http://developer.download.nvidia.com/CgTutorial/cg_tutorial_chapter07.html</li>
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
Die Engine und verschiedenen Szenen wurde in den Browsern Firefox und Chrome getestet.

