# Building & Deploying

Note - Cannot deploy Mac from Windows. Can deploy windows from Mac.

## Windows

Note - Windows build will fail if app is open.

## Mac

0. Set local credentials
   - `./electron-builder.env`
   - Get a new token from https://github.com/settings/personal-access-tokens/new
      - Need fine grained details for todo-today-releases repository only
      - Ensure write access by selecting `Contents` 
   - TeamID: https://developer.apple.com/account#MembershipDetailsCard
   - Password: https://account.apple.com/account/manage
1. Bump version in `package.json`
2. Todo-Today-Website repo: Update Changelog and version numbers in consts.ts. and deploy website 
3. `yarn run deploy-electron-mac-prod`
   - `The binary is not signed with a valid Developer ID certificate.`: See Below
4. Visit https://github.com/TravisBumgarner/Todo-Today-Releases/releases and publish release
5. Logs for the app can be found in `~/Library/Logs/Todo\ Today/main.log`


### Issues

#### The binary is not signed

1. Create a Certificate Signing Request (CSR):

   1. Open the Keychain Access app on your Mac.
   1. From the menu bar, select Keychain Access > Certificate Assistant > Request a Certificate from a Certificate Authority.
   1. Enter your email address and common name, and select Saved to disk.
   1. Click Continue to save the CSR file to your disk.
1. Go to the Apple Developer Certificates page. (https://developer.apple.com/account/resources/certificates/list)
   1. Click the + button to create a new certificate.
   1. Select Developer ID Application and click Continue.
   1. Upload the CSR file you created earlier and click Continue.
   1. Download the certificate and double-click it to add it to your Keychain.
1. Run deploy command again.