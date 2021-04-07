import {Bucket, File, Storage} from "@google-cloud/storage";
import * as tar from "tar";
import * as rimraf from "rimraf";

export class UserBrowserPersistence {
    private readonly root = `${__dirname}/..`;
    private readonly userTar: string;
    private readonly userDataDirSubPath: string;

    public readonly userDataDir: string;

    private bucket: Bucket;
    private file: File;

    constructor(private user: string) {
        this.userTar = `${user}.tar`
        this.userDataDirSubPath = `.chrome/${user}`;
        this.userDataDir = `${this.root}/${this.userDataDirSubPath}`;
        const storage = new Storage();
        this.bucket = storage.bucket('messenger-user-data-dirs');
        this.file = this.bucket.file(this.userTar);
    }

    async tryLoad() {

        this.bucket = (await this.bucket.get({autoCreate: true}))[0];

        const [fileExists] = await this.file.exists();

        if (fileExists) {

            console.log('Found userDataDir...')

            const writeable = tar.x({
                cwd: this.root
            });
            await new Promise(resolve => this.file
                .createReadStream()
                .on("end", resolve)
                .pipe(writeable)
            );

            console.log(' - Done!')
        }
    }

    async save() {
        console.log('Saving userDataDir...')

        const stateFiles = [
            `${this.userDataDirSubPath}/Local State`,
            `${this.userDataDirSubPath}/Default/Cookies`,
            `${this.userDataDirSubPath}/Default/Cookies-journal`,
            `${this.userDataDirSubPath}/Default/Local Storage`,
        ];

        const readable = tar.c({
            gzip: true,
            cwd: `${this.root}`,
        }, stateFiles);

        await new Promise(resolve => readable
            .pipe(this.file.createWriteStream())
            .on("finish", resolve)
        );

        console.log(' - Done!')
    }

    async clear() {
        await new Promise((resolve) => rimraf(`${this.userDataDir}`, resolve));
    }

}