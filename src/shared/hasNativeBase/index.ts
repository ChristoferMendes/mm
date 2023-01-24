import { filesystem } from 'gluegun'
import { IPackageJson } from '../PackageJsonInterface'

export async function hasNativeBase(): Promise<boolean> {
  const packageJson: undefined | IPackageJson = await filesystem.read(
    'package.json',
    'json'
  )

  if (packageJson) return !!packageJson.dependencies['native-base']
}
