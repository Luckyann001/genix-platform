const fs = require('fs')

const originalRename = fs.promises.rename.bind(fs.promises)
const originalCopyFile = fs.promises.copyFile.bind(fs.promises)
const originalUnlink = fs.promises.unlink.bind(fs.promises)
const originalRenameCb = fs.rename.bind(fs)

fs.promises.rename = async (oldPath, newPath) => {
  try {
    return await originalRename(oldPath, newPath)
  } catch (error) {
    if (error && error.code === 'EXDEV') {
      await originalCopyFile(oldPath, newPath)
      await originalUnlink(oldPath)
      return
    }
    throw error
  }
}

fs.rename = (oldPath, newPath, callback) => {
  return originalRenameCb(oldPath, newPath, async (error) => {
    if (!error || error.code !== 'EXDEV') {
      callback(error)
      return
    }

    try {
      await originalCopyFile(oldPath, newPath)
      await originalUnlink(oldPath)
      callback(null)
    } catch (copyError) {
      callback(copyError)
    }
  })
}
