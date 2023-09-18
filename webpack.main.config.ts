import type { Configuration } from 'webpack';
import path from 'path'

import { rules } from './webpack.rules';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },

  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: {
      sharedComponents: path.resolve(__dirname, 'src/react-src/sharedComponents/'),
      modals: path.resolve(__dirname, 'src/react-src/modals/'),
      sharedTypes: path.resolve(__dirname, 'src/react-src/sharedTypes.ts'),
      theme: path.resolve(__dirname, 'src/react-src/theme.tsx'),
      colors: path.resolve(__dirname, 'src/react-src/colors.tsx'),
      utilities: path.resolve(__dirname, 'src/react-src/utilities.ts'),
      Context: path.resolve(__dirname, 'src/react-src/Context.tsx'),
      database: path.resolve(__dirname, 'src/react-src/database.ts')
    }
  },
};
