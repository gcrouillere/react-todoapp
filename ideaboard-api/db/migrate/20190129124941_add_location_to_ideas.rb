class AddLocationToIdeas < ActiveRecord::Migration[5.2]
  def change
    add_column :ideas, :location, :string
  end
end
