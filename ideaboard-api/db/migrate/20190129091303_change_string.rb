class ChangeString < ActiveRecord::Migration[5.2]
  def change
    remove_column :ideas, :string
    add_column :ideas, :position, :int
  end
end
