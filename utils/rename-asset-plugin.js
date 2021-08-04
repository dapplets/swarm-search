module.exports = class RenameAssetPlugin {

    replacer = null;

    constructor(renamer) {
        if (!renamer) throw new Error('replacer is required.');
        this.replacer = renamer;
    }

    apply(compiler) {
        compiler.hooks.thisCompilation.tap('RenameAssetPlugin', (compilation) => {
            compilation.hooks.processAssets.tapAsync({
                name: 'RenameAssetPlugin',
                stage: compilation.PROCESS_ASSETS_STAGE_REPORT,
                assets: true
            }, (assets, callback) => {

                for (const oldFilename in assets) {
                    const newFilename = this.replacer(oldFilename);
                    if (newFilename !== oldFilename) {
                        assets[newFilename] = assets[oldFilename];
                        delete assets[oldFilename];
                    }
                }

                callback();
            });
        });
    }
}