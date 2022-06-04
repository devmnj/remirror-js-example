import {MyEditor} from "../Editor";
import React from 'react'

export default{
    title: 'Remirror Mention',
    Component: MyEditor,

};
 
const Template = (args) => <MyEditor  {...args} />;

//👇 Each story then reuses that template
export const Primary = Template.bind({});
Primary.args = {    
    data:[
        { id: 'joe', label: 'Joe' },
        { id: 'sue', label: 'Sue' },
    ]
    
 };