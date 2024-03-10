module.exports = {
    // Other webpack configuration options...
  
    module: {
      rules: [
        {
          test: /\.tsx?$/, // Match TypeScript files
          exclude: /node_modules/,
          use: 'ts-loader',
        },
      ],
    },
  
    resolve: {
      extensions: ['.tsx', '.ts', '.js'], // Resolve these extensions
    },
  };
  