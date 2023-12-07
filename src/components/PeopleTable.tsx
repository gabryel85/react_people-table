import classNames from 'classnames';
import React from 'react';

import peopleFromServer from '../people.json';
import { Person } from '../types/Person';
import { Button } from './Button';

type State = {
  people: Person[];
  selectedPeople: Person[];
};

export class PeopleTable extends React.Component<{}, State> {
  state: Readonly<State> = {
    people: peopleFromServer,
    selectedPeople: [] as Person[],
  };

  setPerson = (person: Person, isDeleting = false) => () => {
    this.setState(prev => {
      const selectedPeople = isDeleting
        ? prev.selectedPeople.filter(user => user.slug !== person.slug)
        : [...prev.selectedPeople, person];

      return ({
        selectedPeople,
      });
    });
  };

  handleDelete = (person: Person) => () => {
    this.setState(prev => ({
      people: prev.people
        .filter(user => user.slug !== person.slug),
    }));
  }

  moveDown = (person: Person) => () => {
    const { people } = this.state;
    const index = people.findIndex(user => user.slug === person.slug);

    if (index >= people.length - 1) {
      return;
    }

    const updatedPeople = [
      ...people.slice(0, index),
      people[index + 1],
      people[index],
      ...people.slice(index + 2),
    ];

    this.setState({
      people: updatedPeople,
    });
  }

  moveUp = (person: Person) => () => {
    const { people } = this.state;
    const index = people.findIndex(user => user.slug === person.slug);

    if (index === 0) {
      return;
    }

    const updatedPeople = [
      ...people.slice(0, index - 1),
      people[index],
      people[index - 1],
      ...people.slice(index + 1),
    ];

    this.setState({
      people: updatedPeople,
    });
  }

  render() {
    const { people, selectedPeople } = this.state;

    function isSelected(person: Person) {
      return selectedPeople.some(user => user.slug === person.slug);
    }

    if (people.length === 0) {
      return <p>No people yet</p>;
    }

    return (
      <table className="table is-striped is-narrow">
        <caption className="title is-5 has-text-info">
          {selectedPeople?.map(person => person.name).join(', ') || '-'}
        </caption>

        <thead>
          <tr>
            <th> </th>
            <th>name</th>
            <th>sex</th>
            <th>born</th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          {people.map((person, i) => (
            <tr
              key={person.slug}
              className={classNames({
                'has-background-warning': isSelected(person),
              })}
            >
              <td>
                {isSelected(person) ? (
                  <Button
                    onClick={this.setPerson(person, true)}
                    className="is-small is-rounded is-danger"
                  >
                    <span className="icon is-small">
                      <i className="fas fa-minus" />
                    </span>
                  </Button>
                ) : (
                  <Button
                    onClick={this.setPerson(person)}
                    className="is-small is-rounded is-success"
                  >
                    <span className="icon is-small">
                      <i className="fas fa-plus" />
                    </span>
                  </Button>
                )}
              </td>

              <td
                className={classNames({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
                <Button
                  onClick={this.handleDelete(person)}
                  className="delete"
                  type="button"
                >
                  delete
                </Button>
              </td>

              <td>{person.sex}</td>
              <td>{person.born}</td>
              <td className="is-flex is-flex-wrap-nowrap">
                <Button
                  disabled={i >= this.state.people.length - 1}
                  onClick={this.moveDown(person)}
                >
                  &darr;
                </Button>

                <Button
                  disabled={i === 0}
                  onClick={this.moveUp(person)}
                >
                  &uarr;
                </Button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
