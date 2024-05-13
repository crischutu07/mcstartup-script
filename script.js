/*function formatBytes(int) {
  const factor = 1024;

  if (int >= factor) {
    const gb = int / factor;

    if (gb >= 1 && gb < 1.01 || gb >= 10 && gb < 10.01 || gb >= 100 && gb < 100.01 || int % 102400 === 0) {
      return Math.floor(gb) + " GB";
    } else {
      return gb.toFixed(2) + " GB";
    }
  } else {
    return int + " MB";
  }
}*/

/*
// if (document.getElementById('filename').split('.').pop() !== "jar" ){
//   console.log(`required jar`)
// } else {
//   console(true)
// }*/

var values = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24];
const input = document.getElementById('ram');
input.addEventListener('input', () => {
  memory = (values[input.value - 1] * 1024).toFixed(0);
})

function generateScript() {
  var flags = [];

  var flag = document.getElementById("flags").value
  var gui = document.getElementById('guicheck').checked;
  var ptl = document.getElementById('ptl').checked;
  var filename = document.getElementById('filename').value || 'server.jar';
  document.getElementById('bytesvalue').innerText = `${values[input.value]} GB`
  if (ptl) {
    flags.push(`-Xms${(memory * 0.85)?.toFixed(0)}M`, `-Xmx${(memory * 0.85)?.toFixed(0)}M`)
  } else {
    flags.push(`-Xms${memory}M`, `-Xmx${memory}M`);
  }
  switch (flag) {
    case "None":
      flags.push("--add-modules=jdk.incubator.vector");
      break;
    case "Proxy":
      // TODO: Add each object into flags variables.
      flags.push(
        "--add-modules=jdk.incubator.vector",
        "-XX:UseG1GC",
        "-XX:+ParallelRefProcEnabled",
        "-XX:+UnlockExperimentalVMOptions",
        "-XX:+AlwaysPreTouch",
        "-XX:MaxInlineLevel=15",
        "-XX:G1HeapRegionSize=8M",
      )
      break;
    case "Akiar":
      var _a = [
        "--add-modules=jdk.incubator.vector",
        "-XX:UseG1GC",
        "-XX:+ParallelRefProcEnabled",
        "-XX:MaxGCPauseMillis=200",
        "-XX:+UnlockExperimentalVMOptions",
        "-XX:+DisableExplicitGC",
        "-XX:+AlwaysPreTouch",
        "-XX:G1HeapWastePercent=5",
        "-XX:G1MixedGCCountTarget=4",
        "-XX:InitiatingHeapOccupancyPercent=15",
        "-XX:G1MixedGCLiveThresholdPercent=90",
        "-XX:G1RSetUpdatingPauseTimePercent=5",
        "-XX:SurvivorRatio=32",
        "-XX:+PerfDisableSharedMem",
        "-XX:MaxTenuringThreshold=1",
        "-Dusing.aikars.flags=https://mcflags.emc.gs",
        "-Daikars.new.flags=true",
      ]
      if (memory >= 12884) {
        flags.push(..._a, ...Array.from([
          "-XX:G1NewSizePercent=40",
          "-XX:G1MaxNewSizePercent=50",
          "-XX:G1HeapRegionSize=16M",
          "-XX:G1ReservePercent=15",
        ]))
      } else {
        flags.push(..._a, ...Array.from([
          "-XX:G1NewSizePercent=30",
          "-XX:G1MaxNewSizePercent=40",
          "-XX:G1HeapRegionSize=8M",
          "-XX:G1ReservePercent=20",
        ]))
      }
      break;
  }
  flags.push(`--jar ${filename}`)
  if (!gui) flags.push("--nogui")
  document.getElementById("scriptOutput").textContent = `java ${flags.join(' ')}`
  document.getElementById("scriptOutput").removeAttribute("data-highlighted")
  hljs.highlightAll();
}


let downloadButton = document.getElementById('downloadButton');
// TODO: Fix download button doesnt doesnt in blob contents
downloadButton.addEventListener("click", () => {
  const blob = new Blob(
    [document.getElementById("scriptOutput").textContent],
    { type: 'text/plain' }
  );
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'start.sh';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
})
