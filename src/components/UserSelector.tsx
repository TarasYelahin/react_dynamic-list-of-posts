import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useState, useRef } from 'react';
import { User } from '../types/User';
import { Loader } from './Loader';

type Props = {
  users: User[];
  selectedUserId: number | null;
  onSelect: (userId: number | null) => void;
  isLoading: boolean;
  hasError: boolean;
};

export const UserSelector: React.FC<Props> = ({
  users,
  selectedUserId,
  onSelect,
  isLoading,
  hasError,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', outsideClick);

    return () => document.removeEventListener('click', outsideClick);
  }, []);

  return (
    <div
      className={classNames('dropdown', {
        'is-active': isDropdownOpen,
      })}
      data-cy="UserSelector"
    >
      <div className="dropdown-trigger" ref={dropdownRef}>
        <button
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => setIsDropdownOpen(true)}
        >
          <span>
            {users.find(user => user.id === selectedUserId)?.name ||
              'Choose a user'}
          </span>

          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {isLoading ? (
            <Loader />
          ) : hasError ? (
            <span className="dropdown-item">Error loading users</span>
          ) : (
            users.map(user => {
              return (
                <a
                  key={user.id}
                  href={`#user-${user.id}`}
                  className={classNames('dropdown-item', {
                    'is-active': user.id === selectedUserId,
                  })}
                  onClick={() => {
                    onSelect(user.id);
                    setIsDropdownOpen(false);
                  }}
                >
                  {user.name}
                </a>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
