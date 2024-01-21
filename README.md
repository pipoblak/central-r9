# Central R9
#### Management desktop app built to control R9 PC.
<a href="https://www.youtube.com/watch?v=WB6QjWXHYdA&ab_channel=Labz">
<img src="https://github.com/pipoblak/central-r9/assets/18637121/4cf387ef-48e3-4cee-8ebd-2f5e261bc8bc" height="250px"/>
</a>
<a href="https://www.youtube.com/watch?v=WB6QjWXHYdA&ab_channel=Labz">
  <img src="https://github.com/pipoblak/central-r9/blob/main/video.jpeg" height="250px"/>
</a>

### Stack

- Javascript/Typescript
- Electron

### Requirements

- OpenRGB Server Runing at port 6742 in the target Hosts(r9-gaming.local, r9-stream.local) (only required to control LEDS)
- Open Hardware Monitor Runing at port 8085 in the target Hosts(r9-gaming.local, r9-stream.local) (only required to show hardware stats in gaming mode)
- Electron

## Run Development Version

- Install Modules

```bash
  yarn install
```

- Run

```bash
  yarn start
```

## Build Executable

```bash
  yarn package
```

### Used in this project

- [Framer Motion](https://www.framer.com/motion/animation/)
- [Electron Boilerplate](https://electron-react-boilerplate.js.org/)
- [Open RGB SDK](https://github.com/Mola19/openrgb-sdk)
- [Open Hardware Monitor](https://openhardwaremonitor.org/downloads/)
- [Apple Bonjour Service](https://support.apple.com/kb/dl999?locale=pt_BR)
