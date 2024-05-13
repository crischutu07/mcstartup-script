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
const input = document.getElementById('ram');

const values = [];
for (let i = 1; i < 25; i += 0.5) {
  if (i === 24.5) {
    break;
  } else {
    values.push(Number(i))
  }
}

let memory;
let commandOutput;
let modOutput;
let rawOutput = [];
const scriptOutput = document.getElementById('scriptOutput');
const langType = document.getElementById('lang-type');
let lang;

function formatHighlight(value){
  if (value){
    scriptOutput.innerText = value.toString();
  }
  scriptOutput.removeAttribute("data-highlighted")
  console.warn = () => {};
  hljs.highlightAll();
}
Array.prototype.move = function(x, y){
  this.splice(y, 0, this.splice(x, 1)[0]);
  return this;
};

async function generateScript() {
  let flags = [];
  memory = (values[input.value] * 1024).toFixed(0);

  const flag = document.getElementById("flags").value;
  const gui = document.getElementById('guicheck').checked;
  const ptl = document.getElementById('ptl').checked;
  const loop = document.getElementById('loop').checked;
  const filename = document.getElementById('filename').value || 'server.jar';
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
      const _a = [
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
      ];
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
  commandOutput = `java ${flags.join(' ')}`;
  if (!gui) flags.push("--nogui")
  switch (langType.value) {
    case "java":
      lang = "java";
      flags = ["java",...flags]
      break;
    case "bash":
      lang = "bash";
      if(loop){
        flags = [
          "#!/usr/bin/env sh",
          "\nwhile true; do\n",
          "java",
          ...flags,
          "\n",
          "echo \"Press Ctrl + C to stop.\"",
          "\ndone"
        ]
      } else {
        flags = ["#!/usr/bin/env sh","\n","java",...flags]
      }
      scriptOutput.classList.replace(scriptOutput.classList[0], 'language-bash');
      break;
    case "dos":
      lang = "dos";
      if(loop){
        flags = [
          "@echo off",
          "\n:loop",
          "\n",
          "java",
          ...flags,
          "\n",
          "echo Press Ctrl + C to stop.",
          "\ngoto :loop"
        ]
      } else {
        flags = ["@echo off\n","java",...flags]
      }
      scriptOutput.classList.replace(scriptOutput.classList[0], 'language-dos');
      break;
  }
  modOutput = flags.join(' ')
  rawOutput = modOutput;
  formatHighlight(modOutput);
}


let downloadButton = document.getElementById('downloadButton');
let copyButton = document.getElementById('copyButton');
copyButton.addEventListener('click', () => {
  navigator.clipboard.writeText(commandOutput).then(() => {
    alert("Copied the script!")
    console.log("Copied the following values:");
    console.info(commandOutput)
  });
})
downloadButton.addEventListener("click", () => {
  const blob = new Blob(
    [modOutput],
    {type: 'text/plain'}
  );
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  switch (lang){
    case "bash":
      link.download = 'start.sh'
      break
    case "dos":
      link.download = 'start.bat'
      break
    default:
      break
  }
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
})