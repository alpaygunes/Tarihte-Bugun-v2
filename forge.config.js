module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'Alpay GÜNEŞ - Kayseri İl Millli Eğitim Müdürlüğü', 
        icon: './assets/icon.png',
        name: 'BilgiPenceresi.exe',
      },
    },
    // {
    //   name: '@electron-forge/maker-zip',
    //   platforms: ['darwin'],
    // },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          authors: 'Alpay GÜNEŞ - Kayseri İl Millli Eğitim Müdürlüğü', 
          icon: './assets/icon.png',
          name: 'Bilgi Penceresi',
        }
      }
    },
    // {
    //   name: '@electron-forge/maker-rpm',
    //   config: {},
    // },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
