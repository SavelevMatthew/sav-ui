import get from 'lodash/get'
import tokens from '../tokens/tokens.json'

export type ColorPaletteType = { [key: string]: string | ColorPaletteType }

export const colors: ColorPaletteType = get(tokens, ['global', 'color'], {})






