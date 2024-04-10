function formatBytes(int) {
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
}

function copy() {
  const a = document.getElementById("scriptOutput").textContent
  navigator.clipboard.writeText(a).then(function() {
    alert('Copied script.')
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

// if (document.getElementById('filename').split('.').pop() !== "jar" ){
//   console.log(`required jar`)
// } else {
//   console(true)
// }

function generateScript() {
  let c = ''
  if (document.getElementById('guicheck').checked == true) {
    c = ""
  } else {
    c = "--nogui"
  }
  var b = document.getElementById("ram").value;
  const file = document.getElementById('filename').value
  document.getElementById('bytesvalue').innerText = formatBytes(b)
  var filename = `${file}`;
  var akiarFlags = [
    "",
    "-server",
    "-XX:+AlwaysPreTouch",
    "-XX:+DisableExplicitGC",
    "-XX:+ParallelRefProcEnabled",
    "-XX:+PerfDisableSharedMem",
    "-XX:+UnlockExperimentalVMOptions",
    "-XX:+UseG1GC",
    "-XX:G1HeapRegionSize=8M",
    "-XX:G1HeapWastePercent=5",
    "-XX:G1MaxNewSizePercent=40",
    "-XX:G1MixedGCCountTarget=4",
    "-XX:G1MixedGCLiveThresholdPercent=90",
    "-XX:G1NewSizePercent=30",
    "-XX:G1RSetUpdatingPauseTimePercent=5",
    "-XX:G1ReservePercent=20",
    "-XX:InitiatingHeapOccupancyPercent=15",
    "-XX:MaxGCPauseMillis=200",
    "-XX:MaxTenuringThreshold=1",
    "-XX:SurvivorRatio=32",
    "-Dusing.aikars.flags=https://mcflags.emc.gs",
    "-Daikars.new.flags=true",
  ].join(" ")
  var flags = akiarFlags;
  const _a = "while true; do";
  const _b = "done"
  var contents = [
    "#!/usr/bin/env bash",
    `${_a}`,
    `java -Xms${b}M -Xmx${b}M${flags} -jar '${filename}' ${c}`,
    `${_b}`
  ].join("\n");
  // actual auto highlight.js
  document.getElementById("scriptOutput").textContent = contents.toString();
  document.getElementById("scriptOutput").removeAttribute("data-highlighted")
  hljs.highlightAll();
}
let downloadButton = document.getElementById('downloadButton');
downloadButton.addEventListener('click', function() {
  const blob = new Blob([downloadButton.textContent], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'start.sh';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
})
