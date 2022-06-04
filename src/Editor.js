import 'remirror/styles/all.css';
import './use-mention-styles.css';

import { BoldExtension } from 'remirror/extensions';
import {
  MentionExtension,
  MentionExtensionAttributes,
  PlaceholderExtension,
} from 'remirror/extensions';

import {EditorComponent, FloatingWrapper, Remirror,  useMention, useRemirror } from '@remirror/react';
import { useState, useEffect, useCallback } from 'react';
import { cx } from 'remirror';


function UserSuggestor({ allUsers }:MentionExtensionAttributes){
  const [users, setUsers] = useState([]);
  const { state, getMenuProps, getItemProps, indexIsHovered, indexIsSelected } = useMention({
    items: users,
  });

  useEffect(() => {
    if (!state) {
      return;
    }

    const searchTerm = state.query.full.toLowerCase();
    const filteredUsers = allUsers
      .filter((user) => user.label.toLowerCase().includes(searchTerm))
      .sort()
      .slice(0, 5);
    setUsers(filteredUsers);
  }, [state, allUsers]);

  const enabled = !!state;

  return (
    <FloatingWrapper positioner='cursor' enabled={enabled} placement='bottom-start'>
      <div {...getMenuProps()} className='suggestions'>
        {enabled &&
          users.map((user, index) => {
            const isHighlighted = indexIsSelected(index);
            const isHovered = indexIsHovered(index);

            return (
              <div
                key={user.id}
                className={cx('suggestion', isHighlighted && 'highlighted', isHovered && 'hovered')}
                {...getItemProps({
                  item: user,
                  index,
                })}
              >
                {user.label}
              </div>
            );
          })}
      </div>
    </FloatingWrapper>
  );
}


export const MyEditor = (props) => {
  const extensions = useCallback(
    () => [new BoldExtension(),
      new MentionExtension({
        extraAttributes: { type: 'user' },
        matchers: [{ name: 'at', char: '#', appendText: ' ', matchOffset: 0 }],
      }),
      new PlaceholderExtension({ placeholder: `Mention a #user` }),
    ],
    [],
  );
 

  const { manager } = useRemirror({ extensions });

  let allUsers = [
    { id: 'joe', label: 'Joe' },
    { id: 'sue', label: 'Sue' },
    { id: 'pat', label: 'Pat' },
    { id: 'tom', label: 'Tom' },
    { id: 'jim', label: 'Jim' },
  ];
    if(props.data)
      allUsers=props.data
  return (
    <div className='remirror-theme'>
      
      <Remirror manager={manager}  >
        {/* The text editor is placed above the menu to make the zIndex easier to manage for popups */}
        <EditorComponent />
        <UserSuggestor allUsers={allUsers}/>
      </Remirror>
    </div>
  );
};