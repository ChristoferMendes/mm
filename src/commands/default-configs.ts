import { PrismaClient } from '@prisma/client'
import { Command } from 'gluegun/build/types/domain/command'
import { Toolbox } from 'gluegun/build/types/domain/toolbox'
import { isHelpOption } from '../utils/isHelpOption'
import { IGenerateFileOptions } from '../utils/Options'

const prisma = new PrismaClient()

module.exports = {
  name: 'default-configs',
  alias: 'configs',
  description: 'Store default configs (example: --not-index by default)',
  run: async (toolbox: Toolbox) => {
    const { parameters, print, createHelp } = toolbox
    const helper = () => {
      return createHelp({
        options: [
          {
            flag: '--not-index=true',
            alias: '--not-i=true',
            description:
              'Pass this flag if you want it to be your default when creating a file. It can be --not-index=false or --not-index=true',
          },
        ],
        commandName: 'default-configs',
      })
    }

    const isOptionsEmpty = Object.keys(parameters.options).length === 0

    if (isOptionsEmpty) {
      return helper()
    }

    const { notI, notIndex } = parameters.options as IGenerateFileOptions
    if (typeof notI === 'boolean' || typeof notIndex === 'boolean') {
      return print.error('oh no')
    }

    const haveHelp = isHelpOption(parameters.options)

    if (haveHelp) {
      return helper()
    }

    const config = await prisma.defaultConfig.findFirst()

    if (config) {
      await prisma.defaultConfig.update({
        where: { id: config.id },
        data: {
          index: JSON.parse(notI || notIndex),
        },
      })
      return print.success(
        `Default config updated! not-index config: ${notI ?? notIndex}.`
      )
    }

    await prisma.defaultConfig.create({
      data: {
        index: JSON.parse(notI || notIndex),
      },
    })

    print.success(
      `Default config saved! not-index config: ${notI ?? notIndex}.`
    )
  },
} as Command
