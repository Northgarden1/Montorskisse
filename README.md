# Montørskisse

Mobilvennlig prototyp for å merke skjermbilder med nettlinjer, rør, målelinjer og feltobjekter.

## Kjør

Åpne `index.html` i en nettleser, eller kjør den lokale serveren:

```powershell
node dev-server.mjs 8766 0.0.0.0
```

For installering på Android-hjemskjermen bør appen kjøres fra `localhost` under testing eller fra en HTTPS-side.

## Verktøy

- Importer skjermbilde.
- Tegn linje eller polylinje for `LS Kabel`, `HS Kabel`, `LS Luftledning`, `HS Luftledning` og planlagt trase.
- Linjer spør etter navn og gjentar navnet langs traseen.
- Angre under polylinje-plassering fjerner siste punkt, og Enter ferdigstiller polylinjen på PC.
- `Behold verktøy` starter av. Slå det på når du vil plassere flere linjer, rør eller objekter uten å hoppe tilbake til Velg.
- Rediger navn, farge, størrelse og striping på linjetypene fra PC-panelet eller den mobilvennlige `Rediger`-visningen. Oppsettet lagres som lokal profil.
- Plasser Stolpe, Fordeling skap, KV bryter, Lavspenning, Høyspenning og egne feltobjekter.
- KV bryter kan settes fra 50A til 355A og snapper til Stolpe når objektsnap er på.
- Lag nye objekttyper fra objektpanelet. De lagres i profilen til neste gang.
- Objekter viser lesbar etikett ved siden av symbolet.
- Objektsnap fester objekter til nærliggende linjer/polylinjer.
- Velg et objekt og dra håndtakene for størrelse og rotasjon.
- Kryssende nettlinjer viser en liten hump på den nyeste linjen.
- Rørverktøyet kan legges på eksisterende linje eller fritt i bildet.
- Rør har redigerbar etikett, med `110mm Rør` og `Fiber rør` som standardvalg.
- Meterverktøyet kalibreres med en kjent lengde og viser meter automatisk etterpå.
- Snap 45° starter av, men kan slås på fra desktop eller telefon.
- Klyp for zoom og flytt rundt i skjermbildet på touchskjerm. Musehjul zoomer på PC.
- Tegn og lagre egen underskrift, og plasser den med automatisk dato og navn på skjermbildet.
- Angre, gjør om, slett, zoom, lagre prosjekt, åpne prosjekt og eksporter PNG.

## Deling uten IP-adresse

For andre brukere er det enklest å legge mappen på en HTTPS-host, for eksempel GitHub Pages, Netlify, Cloudflare Pages eller en vanlig webserver. Da får du en vanlig lenke, og appen kan installeres på Android-hjemskjermen som PWA.

For epost er beste flyt å sende en vanlig lenke til den publiserte siden. Hvis du sender selve appen som ZIP, må mottakerne pakke ut mappen og åpne `index.html` i Chrome eller Edge. Det fungerer for testing, men er ikke like ryddig som en HTTPS-lenke og kan bli stoppet av epostfilter fordi appen inneholder JavaScript-filer.
