import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Div } from '../../components/div'

export default {
    title: 'Div',
    component: Div,
} as ComponentMeta<typeof Div>

const Template: ComponentStory<typeof Div> = () => <Div/>

export const Primary = Template.bind({})
